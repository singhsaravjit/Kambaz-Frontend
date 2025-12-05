'use client';
import dynamic from 'next/dynamic';

// Dynamically import components that use Redux with SSR disabled
const AddRedux = dynamic(() => import('./AddRedux'), { ssr: false });
const CounterRedux = dynamic(() => import('./CounterRedux'), { ssr: false });
const HelloRedux = dynamic(() => import('./HelloRedux'), { ssr: false });
const TodoList = dynamic(() => import('./todos/TodoList'), { ssr: false });

export default function ReduxExamples() {
  return(
    <div>
      <h2>Redux Examples</h2>
      <HelloRedux />
      <CounterRedux />
      <AddRedux />
      <TodoList />
    </div>
  );
}