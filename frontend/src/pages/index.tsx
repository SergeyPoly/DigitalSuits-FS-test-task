import { GetServerSideProps } from 'next';
import TodoSection from '@/components/TodoSection';
import { getTodos } from '@/utils/api';
import { PaginatedTodosResponse } from '@/types';
import { FC } from 'react'

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const initialTodos = await getTodos(1, 10);
    return {
      props: {
        initialTodos,
      },
    };
  } catch (error) {
    console.error('Error fetching tasks from server:', error);
    return {
      props: {
        initialTodos: {
          total: 0,
          data: [],
        } as PaginatedTodosResponse,
      },
    };
  }
};

interface HomePageProps {
  initialTodos: PaginatedTodosResponse;
}

const HomePage: FC<HomePageProps> = ({ initialTodos }) => {
  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans antialiased">
      <TodoSection initialTodos={initialTodos} />
    </div>
  );
};

export default HomePage;
