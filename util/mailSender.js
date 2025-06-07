const { transporter } = require('../config/nodemailer.js');

exports.mailSender = async (title,email,body)=>
{
    try 
    {
        const response = await transporter.sendMail({
            from : "studySphere@gmail.com",
            to : email,
            subject : title,
            html : body
        })

        
        return response;
    }
    catch(error)
    {   
        console.log("Mailsender",error.message);
    }
}


exports.contactUsMail = async (title,email,body)=>
    {
        try 
        {
            const response = await transporter.sendMail({
                from : email,
                to : "onkar.jondhale@gmail.com",
                subject : title,
                html : body
            })
    
            
            return response;
        }
        catch(error)
        {   
            console.log("Mailsender",error.message);
        }
    }
