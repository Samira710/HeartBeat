import PaymentButton from "@/components/PaymentButton";

export default function AppointmentPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="space-y-6 text-center">
        <h1 className="text-2xl font-bold">Confirm Appointment</h1>

        <PaymentButton />
      </div>
    </div>
  );
}
