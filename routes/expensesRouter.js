const { Router } = require("express");
const expensesModel = require("../models/expensesModel");
const usersModel = require("../models/usersModel");

const expensesRouter = Router();

expensesRouter.post("/", async (req, res) => {
    try {
        const { title, amount, category } = req.body;
        const userId = req.userId;

        if (!title || !amount || !category) {
            return res.status(400).json({ message: "Title, amount, and category are required" });
        }

        const newExpense = await expensesModel.create({
            title,
            amount,
            category,
            user: userId
        });

        // Add expense to user's expenses list
        await usersModel.findByIdAndUpdate(userId, {
            $push: { expenses: newExpense._id }
        });

        res.status(201).json({ message: "Expense created successfully", data: newExpense });
    } catch (error) {
        res.status(500).json({ message: "Error creating expense", error: error.message });
    }
});

expensesRouter.get("/", async (req, res) => {
    try {
        const userId = req.userId;
        const expenses = await expensesModel.find({ user: userId });
        res.json({ data: expenses });
    } catch (error) {
        res.status(500).json({ message: "Error fetching expenses", error: error.message });
    }
});

expensesRouter.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const expense = await expensesModel.findOneAndDelete({ _id: id, user: userId });

        if (!expense) {
            return res.status(404).json({ message: "Expense not found or unauthorized" });
        }

        await usersModel.findByIdAndUpdate(userId, {
            $pull: { expenses: id }
        });

        res.json({ message: "Expense deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting expense", error: error.message });
    }
});

module.exports = expensesRouter;
