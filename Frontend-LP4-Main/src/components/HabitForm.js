import { useForm } from 'react-hook-form';
import { useState } from 'react';
import axios from 'axios';

export function useHabitForm() {
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    const token = localStorage.getItem('jwt');

    try {
      const response = await axios.post('http://localhost:5000/crear-habito', data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSuccessMsg(response.data.message);
      setErrorMsg('');
      reset();
    } catch (error) {
      setSuccessMsg('');
      setErrorMsg(error.response?.data?.message || 'Error al crear hábito');
    }
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    reset,
    errors,
    successMsg,
    errorMsg
  };
}
