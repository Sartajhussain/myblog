import Newsletter from '../models/newsletter.model.js';

export const subscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false, message: "Email is required"
            });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address",
            });
        }
        const existingSubscriber = await Newsletter.findOne({
            email: email.toLowerCase(),
        });
        if (existingSubscriber) {
            return res.status(409).json({
                success: false,
                message: "This email is already subscribed",
            });
        }
        const subscriber = await Newsletter.create({
            email: email.toLowerCase(),
        });
        return res.status(201).json({
            success: true,
            message: "Successfully subscribed to the newsletter!",
            subscriber,
        });

    }


    catch (error) {
        console.error("Newsletter subscription error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later.",
        });
    }
}
export const getSubscriberCount = async (req, res) => {
  try {
    const totalSubscribers = await Newsletter.countDocuments();

    return res.status(200).json({
      success: true,
      totalSubscribers,
    });
  } catch (error) {
    console.error("Get subscriber count error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to get subscriber count",
    });
  }
};