import { useForm } from "react-hook-form";
import api from "../../utils/axiosConfig";

export function useHabitForm() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    // Construye objeto para enviar al backend
    const habitData = {
      title: data.title,
      category: data.category || "Otros",
      frequency: data.frequency,
      startTime: data.startTime ? new Date(data.startTime).toISOString() : undefined,
      durationMinutes: data.durationMinutes ? parseInt(data.durationMinutes) : 30,
      daysOfWeek: data.daysOfWeek || [],
      goal: data.goal ? Number(data.goal) : undefined // ← nuevo
    };

    try {
      const response = await api.post("/crear-habito", habitData);
      reset();
      return {
        success: true,
        message: response.data.message,
        habit: response.data.habit
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Error al crear hábito"
      };
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    reset,
    watch,
    errors
  };
}

export default useHabitForm;