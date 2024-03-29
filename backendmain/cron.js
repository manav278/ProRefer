import Notreplied from "./Algorithm/Notreplied.js";
import currReqModel from "./Model/currentrequest.js";
import schedule from "node-schedule";
// second minute hour day month day_of_week
const job = schedule.scheduleJob("30 * * * * *", async () => {
  let currRequests = await currReqModel.find({});
  console.log(currRequests);
  if (currRequests != null) {
    currRequests.forEach((curr) => {
      Notreplied(curr.Referral_ID);
    });
  }
});
export default job;
