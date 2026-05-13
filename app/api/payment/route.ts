import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  try {
    const { appointmentId, userId } = await req.json();

    if (!appointmentId || !userId) {
      return NextResponse.json(
        { error: "Missing appointmentId or userId" },
        { status: 400 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "HeartBeat Appointment Payment",
            },
            unit_amount: 2500,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/patients/${userId}/new-appointment/success?appointmentId=${appointmentId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment?appointmentId=${appointmentId}&userId=${userId}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);

    return NextResponse.json(
      { error: "Payment session failed" },
      { status: 500 }
    );
  }
}
