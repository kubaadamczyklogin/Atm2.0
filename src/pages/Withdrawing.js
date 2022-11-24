import Layout from "./../components/Layout";
import AmountInput from "./../components/AmountInput";
import WithdrawButtons from "./../components/WithdrawButtons";
import { useState } from "react";
import {
  currency,
  withdrawLimit,
  withdrawalsDenominations
} from "./../settings";

export default function Withdrawing(props) {
  const { setPage, setStatementData, setBalance, balance } = props;
  const [amount, setAmount] = useState("");
  const header = "How much do you wont to withdraw?";

  const validation = (amount) => {
    if (amount < 1) {
      return "You have not entered any amount";
    } else if (amount > balance) {
      return "You do not have enought money in your account";
    } else if (withdrawLimit && amount > withdrawLimit) {
      return `The maximum amount you can withdraw in this ATM is ${withdrawLimit} ${currency}`;
    } else if (
      !(
        withdrawalsDenominations === null ||
        amount % withdrawalsDenominations[0] === 0 ||
        amount % withdrawalsDenominations[1] === 0 ||
        (amount % withdrawalsDenominations[1]) % withdrawalsDenominations[0] ===
          0
      )
    ) {
      let denominations = "";
      withdrawalsDenominations.forEach((item, index) => {
        denominations += `${index !== 0 ? ", " : ""} ${item}`;
      });
      return `The ATM only pays in denominations: ${denominations} ${currency}`;
    } else {
      return "ok";
    }
  };

  const goBack = () => {
    setPage("start");
  };

  const confirm = (amountNamber = Number(amount)) => {
    const validationResult = validation(amountNamber);

    if (validationResult === "ok") {
      setBalance((prev) => prev - amountNamber);
      setStatementData({
        text: `You have withdrawn ${amountNamber} ${currency} from your account`
      });
      setPage("success");
    } else {
      setStatementData({
        header: validationResult,
        text: "Do you want to withdraw a different amount?",
        page: "withdrawing"
      });
      setPage("error");
    }
  };

  return (
    <Layout
      header={header}
      balance={balance}
      leftButtons={[{ text: "Back", action: goBack }]}
      rightButtons={[{ text: "Confirm", action: confirm }]}
      keyboarListener={{
        onCancel: goBack,
        onConfirm: confirm,
        setAmount: setAmount
      }}
    >
      <AmountInput amount={amount} setAmount={setAmount} />
      <WithdrawButtons action={confirm} />
    </Layout>
  );
}
