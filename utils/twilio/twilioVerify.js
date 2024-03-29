// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid =  process.env.ACCOUNTSIDTWILIO;
const authToken = process.env.AUTHTOCKENTWILIO;
const client = require('twilio')(accountSid, authToken);
const countryCode = process.env.COUNTRYCODE;
const serviceSid = process.env.SERVICESIDTWILIO;



module.exports = async function twilioVerify(phoneNumber,otp){
  console.log(phoneNumber,otp)
 try {
  const verificationChecks =  await client.verify.v2.services(`${serviceSid}`) 
  .verificationChecks
  .create({to:`${countryCode}${phoneNumber}`, code: `${otp}`})

  return verificationChecks
 } catch (error) {
  console.error('Error during otp verification ')
  throw error
 }
};