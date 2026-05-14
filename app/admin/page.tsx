import Image from "next/image";
import Link from "next/link";

import { StatCard } from "@/components/StatCard";
import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/DataTable";
import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";

const AdminPage = async ({
  searchParams,
}: {
  searchParams: { filter?: string };
}) => {
  const appointments = await getRecentAppointmentList();
  const filter = searchParams.filter || "default";
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  let displayData = appointments.documents;

  if (filter === "scheduled") {
    displayData = appointments.documents.filter(
      (app: any) => app.status === "scheduled"
    );
  } else if (filter === "pending") {
    displayData = appointments.documents.filter(
      (app: any) => app.status === "pending"
    );
  } else if (filter === "cancelled") {
    displayData = appointments.documents.filter(
      (app: any) => app.status === "cancelled"
    );
  } else {
    // DEFAULT VIEW: Only appointments scheduled or pending for TODAY.
    displayData = appointments.documents.filter((app: any) => {
      const appDate = new Date(app.schedule);
      const isToday = appDate >= todayStart && appDate <= todayEnd;
      return isToday && app.status !== "cancelled";
    });
  }

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
          <h1 className="header">Welcome 🙋‍♀️</h1>
          <p className="text-dark-700">
            Let's start the day with managing new appointments
          </p>
        </section>

        <section className="admin-stat">
          <h2 className="sub-header text-white">
            {filter === "default"
              ? "Today's Appointments"
              : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Appointments`}
          </h2>

          {filter !== "default" && (
            <Link
              href="/admin"
              className="text-14-medium text-green-500 hover:underline"
            >
              &larr; Clear Filters
            </Link>
          )}
          <Link href="/admin?filter=scheduled" className="w-full">
            <StatCard
              type="appointments"
              count={appointments.scheduledCount}
              label="Scheduled appointments"
              icon={"/assets/icons/appointments.svg"}
            />
          </Link>

          <Link href="/admin?filter=pending" className="w-full">
            <StatCard
              type="pending"
              count={appointments.pendingCount}
              label="Pending appointments"
              icon={"/assets/icons/pending.svg"}
            />
          </Link>

          <Link href="/admin?filter=cancelled" className="w-full">
            <StatCard
              type="cancelled"
              count={appointments.cancelledCount}
              label="Cancelled appointments"
              icon={"/assets/icons/cancelled.svg"}
            />
          </Link>
        </section>

        <DataTable columns={columns} data={displayData} />
      </main>
    </div>
  );
};

export default AdminPage;
