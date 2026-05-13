import PaymentCard from "@/components/PaymentCard";

export default function PaymentPage({
  searchParams,
}: {
  searchParams: {
    appointmentId?: string;
    userId?: string;
    doctor?: string;
    date?: string;
  };
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0f1117] px-6 py-10">
      <PaymentCard
        appointmentId={searchParams.appointmentId}
        userId={searchParams.userId}
        doctor={searchParams.doctor}
        date={searchParams.date}
      />
    </main>
  );
}
