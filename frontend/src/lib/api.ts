export type Service = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  durationMinutes: number;
  bufferMinutes: number;
  price: number;
  categoryId: string | null;
  categoryName: string;
};

export type Slot = {
  startTime: string; // instante em UTC, é o que volta no agendamento
  label: string; // texto do botão, ex.: "09:30"
};

export type Appointment = {
  id: string;
  clientName: string;
  serviceId: string;
  startTime: string;
  endTime: string;
  status: string;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function handle<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = `Erro ${response.status}`;
    try {
      const body = await response.json();
      if (body.detail) message = body.detail;
    } catch {
      // resposta sem JSON: mantém a mensagem genérica
    }
    throw new ApiError(message, response.status);
  }
  return response.json();
}

export async function getServices(): Promise<Service[]> {
  return handle(await fetch("/api/services"));
}

export async function getSlots(date: string, serviceId: string): Promise<Slot[]> {
  return handle(await fetch(`/api/slots?date=${date}&serviceId=${serviceId}`));
}

export async function bookAppointment(data: {
  clientName: string;
  clientPhone: string;
  serviceId: string;
  startTime: string;
}): Promise<Appointment> {
  return handle(
    await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
  );
}

export type PublicSettings = { whatsapp: string | null };

export async function getPublicSettings(): Promise<PublicSettings> {
  return handle(await fetch("/api/settings"));
}
