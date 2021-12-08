import express, { Request, Response } from "express";
import { requireAuth } from "@microservices-node-react/common";
import { Order } from "../models/Order";

const router = express.Router();

router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
    const orders = await Order.find({
        userId: req.currentUser!.id,
    }).populate("ticket");
    res.status(200).send(orders);
});

export { router as fetchOrdersRouter };
