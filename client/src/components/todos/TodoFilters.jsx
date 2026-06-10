const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'done', label: 'Done' },
];

export default function TodoFilters({ filter, onChange }) {
  return (
    <div className="todo-filters" aria-label="Todo filters">
      {FILTERS.map((item) => (
        <button
          key={item.value}
          className={`btn ${filter === item.value ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
