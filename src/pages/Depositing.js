import Layout from "./../components/Layout";
import AmountInput from "./../components/AmountInput";
import { useState } from "react";
import { currency, depositLimit, depositsDenominations } from "./../settings";

export default function Depositing(props) {
  const { setPage, setStatementData, setBalance, balance } = props;
  const [amount, setAmount] = useState("");
  const header = "Enter the amount that you are depositing";

  const validation = (amount) => {
    if (amount < 1) {
      return "You have not entered any amount";
    } else if (depositLimit && amount > depositLimit) {
      return `The maximum amount you can deposit in this ATM is ${depositLimit} ${currency}`;
    } else if (
      !(
        depositsDenominations === null ||
        amount % depositsDenominations[0] === 0 ||
        amount % depositsDenominations[1] === 0 ||
        (amount % depositsDenominations[1]) % depositsDenominations[0] === 0
      )
    ) {
      let denominations = "";
      depositsDenominations.forEach((item, index) => {
        denominations += `${index !== 0 ? ", " : ""} ${item}`;
      });
      return `The ATM accepts denominations: ${denominations} ${currency}`;
    } else {
      return "ok";
    }
  };

  const goBack = () => {
    setPage("start");
  };

  const confirm = () => {
    const amountNamber = Number(amount);
    const validationResult = validation(amountNamber);

    if (validationResult === "ok") {
      setBalance((prev) => prev + amountNamber);
      setStatementData({
        text: `You deposited ${amountNamber} ${currency} into your account`
      });
      setPage("success");
    } else {
      setStatementData({
        header: validationResult,
        text: "Do you want to deposit a different amount?",
        page: "depositing"
      });
      setPage("error");
    }
  };

  return (
    <Layout
      pageClass="depositing"
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
    </Layout>
  );
}
