import { Router } from "express";
import {
  createAccounts,
  getAccountLogin,
} from "../controllers/account.controller";
const router = Router();

// router.get('/', getUsuarios);
router.post("/", createAccounts);
router.post("/login", getAccountLogin);

export default router;
