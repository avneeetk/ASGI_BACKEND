export const generateToken = (user, message, statusCode, res) => {
  try {
    // Ensure the generateJsonWebToken method exists and works
    const token = user.generateJsonWebToken();

    // Determine the cookie name based on the user's role
    const cookieName = user.role === 'Admin' ? 'adminToken' : 'patientToken';

    // Check if COOKIE_EXPIRE is set and is a valid number
    const cookieExpire = process.env.COOKIE_EXPIRE
      ? parseInt(process.env.COOKIE_EXPIRE, 10)
      : 7; // Default to 7 days if COOKIE_EXPIRE is not set

    // Set cookie options
    const cookieOptions = {
      expires: new Date(Date.now() + cookieExpire * 24 * 60 * 60 * 1000), // Set expiration time
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true only in production
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', // SameSite='None' for cross-site, 'Lax' for development
    };

    // Send cookie and response
    res
      .status(statusCode)
      .cookie(cookieName, token, cookieOptions)
      .json({
        success: true,
        message,
        user,
        token,
      });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
