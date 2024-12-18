// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./YydyToken.sol";

contract Exchange {
    using SafeMath for uint256;
    address public feeAccount;
    uint256 public feePerent;
    address constant ETHER = address(0);

    mapping(address => mapping(address => uint256)) public tokens;

    struct _Order {
        uint256 id;
        address user;
        //创建订单的人
        address tokenGet;
        uint256 amountGet;
        //购买订单的人
        address tokenGive;
        uint256 amountGive;
        uint256 orderStatus; //1创建 2取消 3完成
        uint256 timestamp;
    }
    mapping(uint256 => _Order) public orders;
    uint256 public orderCount;

    constructor(address _feeAccount, uint256 _feePerent) {
        feeAccount = _feeAccount;
        feePerent = _feePerent;
    }

    event Deposit(address token, address user, uint256 amount, uint256 balance);
    event withDraw(
        address token,
        address user,
        uint256 amount,
        uint256 balance
    );
    event Order(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 orderStatus,
        uint256 timeStemp
    );
    event Cancel(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 orderStatus,
        uint256 timeStemp
    );
    event Finish(
        uint256 id,
        address user,
        address tokenGet,
        uint256 amountGet,
        address tokenGive,
        uint256 amountGive,
        uint256 orderStatus,
        uint256 timeStemp
    );

    function depositEther() public payable {
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
        emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
    }

    function depositToken(address _token, uint256 _amount) public {
        require(_token != ETHER);
        require(
            YydyToken(_token).transferFrom(msg.sender, address(this), _amount)
        );
        tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    function withDrawEther(uint256 _amount) public {
        require(tokens[ETHER][msg.sender] >= _amount);
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].sub(_amount);
        payable(msg.sender).transfer(_amount);
        emit withDraw(ETHER, msg.sender, _amount, tokens[ETHER][msg.sender]);
    }

    function withDrawToken(address _token, uint256 _amount) public {
        require(_token != ETHER);
        require(tokens[_token][msg.sender] >= _amount);
        tokens[_token][msg.sender] = tokens[_token][msg.sender].sub(_amount);
        require(YydyToken(_token).transfer(msg.sender, _amount));
        emit withDraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

    function balanceOf(
        address _token,
        address user
    ) public view returns (uint256) {
        return tokens[_token][user];
    }

    function makerOrder(
        address _tokenGet,
        uint256 _amountGet,
        address _tokenGive,
        uint256 _amountGive
    ) public {
        orderCount = orderCount.add(1);
        orders[orderCount] = _Order(
            orderCount,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            1,
            block.timestamp
        );
        emit Order(
            orderCount,
            msg.sender,
            _tokenGet,
            _amountGet,
            _tokenGive,
            _amountGive,
            1,
            block.timestamp
        );
    }

    function cancelOrder(uint256 _id) public {
        _Order memory myOrder = orders[_id];
        require(myOrder.id == _id);
        orders[_id] = _Order(
            myOrder.id,
            msg.sender,
            myOrder.tokenGet,
            myOrder.amountGet,
            myOrder.tokenGive,
            myOrder.amountGive,
            2,
            block.timestamp
        );
        emit Cancel(
            myOrder.id,
            msg.sender,
            myOrder.tokenGet,
            myOrder.amountGet,
            myOrder.tokenGive,
            myOrder.amountGive,
            2,
            block.timestamp
        );
    }

    function finishOrder(uint256 _id) public {
        _Order memory myOrder = orders[_id];
        require(myOrder.id == _id);
        orders[_id] = _Order(
            myOrder.id,
            myOrder.user,
            myOrder.tokenGet,
            myOrder.amountGet,
            myOrder.tokenGive,
            myOrder.amountGive,
            3,
            block.timestamp
        );
        uint256 feeAmount = myOrder.amountGet.mul(feePerent).div(100);
        //创建订单人
        //减 tokenGet amountGet
        //加 tokenGive  amountGive
        tokens[myOrder.tokenGet][myOrder.user] = tokens[myOrder.tokenGet][
            myOrder.user
        ].add(myOrder.amountGet);
        tokens[myOrder.tokenGive][myOrder.user] = tokens[myOrder.tokenGive][
            myOrder.user
        ].sub(myOrder.amountGive);
        // 完成订单人
        //加 tokenGive amountGive
        //减 tokenGet amountGet
        tokens[myOrder.tokenGet][msg.sender] = tokens[myOrder.tokenGet][
            msg.sender
        ].sub(myOrder.amountGet.add(feeAmount));
        tokens[myOrder.tokenGive][msg.sender] = tokens[myOrder.tokenGive][
            msg.sender
        ].add(myOrder.amountGive);

        tokens[myOrder.tokenGet][feeAccount] = tokens[myOrder.tokenGet][
            feeAccount
        ].add(feeAmount);

        emit Finish(
            myOrder.id,
            myOrder.user,
            myOrder.tokenGet,
            myOrder.amountGet,
            myOrder.tokenGive,
            myOrder.amountGive,
            3,
            block.timestamp
        );
    }
}
