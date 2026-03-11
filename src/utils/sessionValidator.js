import { NextResponse } from 'next/server';

export async function validateSession(request) {
  const token = request.headers.get('sessiontoken');

  if (!token) {
    console.log("sessionValidator: No session token provided");
    return {
      success: false,
      errorCode: 'NO_TOKEN_PROVIDED',
      message: 'No session token provided',
      status: 401,
    };
  }

  try {
    const verifyResponse = await fetch(`${request.nextUrl.origin}/api/auth/verify_session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    const responseData = await verifyResponse.json();

    if (verifyResponse.ok && responseData.success) {
      return {
        success: true,
        sessionToken: responseData.sessionToken,
      };
    } else {
      console.log(`sessionValidator: ${responseData.message || 'Session verification failed'}`);
      return {
        success: false,
        errorCode: responseData.errorCode || 'SESSION_VERIFICATION_FAILED',
        message: responseData.message || 'Session verification failed',
        status: verifyResponse.status || 401,
      };
    }
  } catch (error) {
    console.error('sessionValidator: Database connection error', error);
    return {
      success: false,
      errorCode: 'DATABASE_ERROR',
      message: 'Database connection error',
      status: 503,
    };
  }
} 