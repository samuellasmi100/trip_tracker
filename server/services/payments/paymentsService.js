const paymentsDb = require("./paymentsDb");

const getPayments = async (id, vacationId) => {
  return await paymentsDb.getPayments(id, vacationId);
};
const getHistoryPayments = async (id, vacationId) => {
  return await paymentsDb.getHistoryPayments(id, vacationId);
};
const addPayments = async (paymentDetails, vacationId) => {
  const checkIfUserAlreadyAddedPayments = await getPayments(
    paymentDetails.familyId,

    vacationId
  );

  const plannedPayments = Number(paymentDetails.number_of_payments);

  const existingPaymentsCount = Object.keys(paymentDetails).filter((key) =>
    key.startsWith("id_")
  ).length;

  if (checkIfUserAlreadyAddedPayments.length === 0) {
    for (let i = 1; i <= plannedPayments; i++) {
      const amountReceived = paymentDetails[`amountReceived_${i}`];
      const paymentDate = paymentDetails[`paymentDate_${i}`];
      const paymentCurrency = paymentDetails[`paymentCurrency_${i}`];
      const formOfPayment = paymentDetails[`formOfPayment_${i}`];
      if (amountReceived && paymentDate && paymentCurrency && formOfPayment) {
        await paymentsDb.addPayments({
          amountReceived,
          amount: paymentDetails.amount,
          formOfPayment,
          paymentCurrency,
          paymentDate,
          familyId: paymentDetails.familyId,
          userId: paymentDetails.userId,
          invoice: paymentDetails.invoice,
          vacationId,
        });
      }
    }
  } else {
    if (existingPaymentsCount < plannedPayments) {
      let newDataForMissing = false;
      for (let i = 1; i <= plannedPayments; i++) {
        if (!paymentDetails.hasOwnProperty(`id_${i}`)) {
          if (
            paymentDetails[`amountReceived_${i}`] ||
            paymentDetails[`paymentDate_${i}`] ||
            paymentDetails[`paymentCurrency_${i}`] ||
            paymentDetails[`formOfPayment_${i}`]
          ) {
            newDataForMissing = true;
            break;
          }
        }
      }

      if (newDataForMissing) {
        for (let i = 1; i <= plannedPayments; i++) {
          if (!paymentDetails.hasOwnProperty(`id_${i}`)) {
            const amountReceived = paymentDetails[`amountReceived_${i}`];
            const paymentDate = paymentDetails[`paymentDate_${i}`];
            const paymentCurrency = paymentDetails[`paymentCurrency_${i}`];
            const formOfPayment = paymentDetails[`formOfPayment_${i}`];
            if (
              amountReceived &&
              paymentDate &&
              paymentCurrency &&
              formOfPayment
            ) {
              await paymentsDb.addPayments({
                amountReceived,
                paymentDate,
                formOfPayment,
                paymentCurrency,
                userId: paymentDetails.userId,
                familyId: paymentDetails.familyId,
                amount: paymentDetails.amount,
                vacationId,
              });
            }
          }
        }
      } else {
        for (let i = 1; i <= plannedPayments; i++) {
          if (paymentDetails.hasOwnProperty(`id_${i}`)) {
            const amountReceived = paymentDetails[`amountReceived_${i}`];
            const paymentDate = paymentDetails[`paymentDate_${i}`];
            const paymentCurrency = paymentDetails[`paymentCurrency_${i}`];
            const formOfPayment = paymentDetails[`formOfPayment_${i}`];
            const isPaid = paymentDetails[`isPaid_${i}`] === 0 ? false : true;
            const id = paymentDetails[`id_${i}`];
            if (
              amountReceived &&
              paymentDate &&
              paymentCurrency &&
              formOfPayment
            ) {
              await paymentsDb.updatePayments({
                paymentDate,
                formOfPayment,
                paymentCurrency,
                amountReceived,
                familyId: paymentDetails.familyId,
                vacationId,
                isPaid,
                id,
              });
            }
          }
        }
      }
    } else {
      for (let i = 1; i <= plannedPayments; i++) {
        const amountReceived = paymentDetails[`amountReceived_${i}`];
        const paymentDate = paymentDetails[`paymentDate_${i}`];
        const paymentCurrency = paymentDetails[`paymentCurrency_${i}`];
        const formOfPayment = paymentDetails[`formOfPayment_${i}`];
        const isPaid = paymentDetails[`isPaid_${i}`] === 0 ? false : true;
        const id = paymentDetails[`id_${i}`];
        if (amountReceived && paymentDate && paymentCurrency && formOfPayment) {
          await paymentsDb.updatePayments({
            paymentDate,
            formOfPayment,
            paymentCurrency,
            amountReceived,
            familyId: paymentDetails.familyId,
            vacationId,
            isPaid,
            id,
          });
        }
      }
    }
  }
};

// const addPayments = async (paymentDetails, vacationId) => {
//     const checkIfUserAlradyaddPayments = await getPayments(paymentDetails.familyId, vacationId)

//     const plannedPayments = Number(paymentDetails.number_of_payments);

//     const existingPaymentsCount = Object.keys(paymentDetails)
//         .filter(key => key.startsWith('id_'))
//         .length;

//     if (checkIfUserAlradyaddPayments.length === 0) {
//         for (let i = 1; i <= Number(paymentDetails.number_of_payments); i++) {
//             const amountReceived = paymentDetails[`amountReceived_${i}`];
//             const paymentDate = paymentDetails[`paymentDate_${i}`];
//             const paymentCurrency = paymentDetails[`paymentCurrency_${i}`];
//             const formOfPayment = paymentDetails[`formOfPayment_${i}`];
//             if (amountReceived && paymentDate && paymentCurrency && formOfPayment) {
//                 await paymentsDb.addPayments({
//                     amountReceived,
//                     amount: paymentDetails.amount,
//                     formOfPayment,
//                     paymentCurrency,
//                     paymentDate,
//                     familyId: paymentDetails.familyId,
//                     userId: paymentDetails.userId,
//                     invoice: paymentDetails.invoice,
//                     vacationId,
//                 });
//             }
//         }
//     }else {
//         console.log(paymentDetails)
//         console.log(existingPaymentsCount,"existingPaymentsCount")
//         console.log(plannedPayments,"plannedPayments")
//         if (existingPaymentsCount < plannedPayments) {
//             for (let i = 1; i <= plannedPayments; i++) {
//                 if (!paymentDetails.hasOwnProperty(`id_${i}`)) {
//                     await paymentsDb.addPayments({
//                         amountReceived: paymentDetails[`amountReceived_${i}`],
//                         paymentDate: paymentDetails[`paymentDate_${i}`],
//                         formOfPayment: paymentDetails[`formOfPayment_${i}`],
//                         paymentCurrency: paymentDetails[`paymentCurrency_${i}`],
//                         isPaid: paymentDetails.hasOwnProperty(`isPaid_${i}`) ? paymentDetails[`isPaid_${i}`] : 0,
//                         userId: paymentDetails.userId,
//                         familyId: paymentDetails.familyId,
//                         amount: paymentDetails.amount,
//                         vacationId
//                     });
//                 }
//             }

//         } else {
//             for (let i = 1; i <= Number(paymentDetails.number_of_payments); i++) {
//                 const amountReceived = paymentDetails[`amountReceived_${i}`];
//                 const paymentDate = paymentDetails[`paymentDate_${i}`];
//                 const paymentCurrency = paymentDetails[`paymentCurrency_${i}`];
//                 const formOfPayment = paymentDetails[`formOfPayment_${i}`];
//                 const isPaid = paymentDetails[`isPaid_${i}`] === 0 ? false : true;
//                 const id = paymentDetails[`id_${i}`];
//                     await paymentsDb.updatePayments({
//                         paymentDate,
//                         formOfPayment,
//                         paymentCurrency,
//                         amountReceived,
//                         familyId: paymentDetails.familyId,
//                         vacationId,
//                         isPaid,
//                         id
//                     });
//             }
//         }
//     }

// }

module.exports = {
  addPayments,
  getPayments,
  getHistoryPayments,
};
