type Props = {
  title: string;
  value: string;
};

export default function SensorCard({ title, value }: Props) {
  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-sm text-gray-600">{title}</h2>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}