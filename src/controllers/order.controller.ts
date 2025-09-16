import { Request, Response } from 'express';
import Order from '../models/order.model';
import { IOrder } from '../models/order.model';
import { IUser } from '../models/user.model';

/**
 * @desc    Create a new order
 * @route   POST /api/orders
 * @access  Private
 */
export const addOrderItems = async (req: Request, res: Response) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }
    
    const order: IOrder = new Order({
      orderItems,
      user: req.user?._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
    
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error: Could not create order', error: error.message });
  }
};

/**
 * @desc    Get logged-in user's orders
 * @route   GET /api/orders/myorders
 * @access  Private
 */
export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user?._id });
    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error: Could not fetch orders', error: error.message });
  }
};

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (order) {
      if (!('name' in order.user)) {
        return res.status(500).json({ message: 'Server Error: User data could not be populated' });
      }

      if (order.user._id.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized to view this order' });
      }
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Server Error: Could not fetch order', error: error.message });
  }
};