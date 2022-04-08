import CreateItemResolver from './../resolvers/item/CreateItem';
import { buildSchema } from 'type-graphql';
import RegisterResolver from '@resolvers/auth/Register';
import LoginResolver from '@resolvers/auth/Login';
import MeResolver from '@resolvers/auth/Me';
import LogoutResolver from '@resolvers/auth/Logout';
import ConfirmEmailResolver from '@resolvers/auth/ConfirmEmail';
import ResetPasswordResolver from '@resolvers/auth/ResetPassword';
import ForgotPasswordResolver from '@resolvers/auth/ForgotPassword';
import SendVerificationEmailResolver from '@resolvers/auth/SendVerificationEmail';
import GetItemsResolver from '@resolvers/item/GetItems';
import GetItemResolver from '@resolvers/item/GetItem';
import UpdateItemResolver from '@resolvers/item/UpdateItem';
import DeleteItemResolver from '@resolvers/item/DeleteItem';
import customAuthChecker from '@middleware/customAuthChecker';
import TestResolver from '@test_utils/TestResolver';
import UpdateCartResolver from '@resolvers/cartItem/UpdateCart';
import GetCartResolver from '@resolvers/cartItem/GetCart';
import CheckoutResolver from '@resolvers/checkout/Checkout';

const createSchema = () =>
  buildSchema({
    resolvers: [
      LoginResolver,
      RegisterResolver,
      MeResolver,
      LogoutResolver,
      ConfirmEmailResolver,
      ResetPasswordResolver,
      ForgotPasswordResolver,
      SendVerificationEmailResolver,
      CreateItemResolver,
      GetItemsResolver,
      GetItemResolver,
      UpdateItemResolver,
      DeleteItemResolver,
      UpdateCartResolver,
      GetCartResolver,
      CheckoutResolver,
      TestResolver,
    ],
    authChecker: customAuthChecker,
  });

export default createSchema;
