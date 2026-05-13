import Image from "next/image";
import Link from "next/link";

import { StatCard } from "@/components/StatCard";
import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/DataTable";
import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";

const AdminPage = async ({ searchParams }: SearchParamProps) => {
  const appointments = await getRecentAppointmentList();

  const day = Number(searchParams.day || 0);

  const selectedDate = new Date();
  selectedDate.setDate(selectedDate.getDate() - day);

  const selectedDayAppointments = appointments.documents.filter(
    (appointment: any) => {
      const appointmentDate = new Date(appointment.schedule);

      return (
        appointmentDate.getDate() === selectedDate.getDate() &&
        appointmentDate.getMonth() === selectedDate.getMonth() &&
        appointmentDate.getFullYear() === selectedDate.getFullYear()
      );
    }
  );

  const scheduledCount = selectedDayAppointments.filter(
    (appointment: any) => appointment.status === "scheduled"
  ).length;

  const pendingCount = selectedDayAppointments.filter(
    (appointment: any) => appointment.status === "pending"
  ).length;

  const cancelledCount = selectedDayAppointments.filter(
    (appointment: any) => appointment.status === "cancelled"
  ).length;

  const formattedDate = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header">
        <Link href="/" className="cursor-pointer">
          <Image
            src="/assets/icons/logo-full.svg"
            height={32}
            width={162}
            alt="logo"
            className="h-8 w-fit"
          />
        </Link>

        <p className="text-16-semibold">Admin Dashboard</p>
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">
            Showing appointments for {formattedDate}
          </p>
        </section>

        <section className="admin-stat">
          <StatCard
            type="appointments"
            count={scheduledCount}
            label="Scheduled appointments"
            icon={"/assets/icons/appointments.svg"}
          />

          <StatCard
            type="pending"
            count={pendingCount}
            label="Pending appointments"
            icon={"/assets/icons/pending.svg"}
          />

          <StatCard
            type="cancelled"
            count={cancelledCount}
            label="Cancelled appointments"
            icon={"/assets/icons/cancelled.svg"}
          />
        </section>

        <DataTable columns={columns} data={selectedDayAppointments} day={day} />
      </main>
    </div>
  );
};

export default AdminPage;
