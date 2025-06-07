const { contactUsMail } = require('../util/mailSender.js');

exports.contactUs = async (req, res) => {
  const { email, firstname, lastname, message, phoneNo, countrycode } = req.body
  console.log(req.body)
  try {
    const emailRes = await contactUsMail(
      "Your Data send successfully",
      email,
      `<h1> ${email}, ${firstname}, ${lastname}, ${message}, ${phoneNo}, ${countrycode} </h1>`
    )
    console.log("Email Res ", emailRes)
    return res.json({
      success: true,
      message: "Email send successfully",
    })
  } catch (error) {
    console.log("Error", error)
    console.log("Error message :", error.message)
    return res.json({
      success: false,
      message: "Something went wrong...",
    })
  }
}