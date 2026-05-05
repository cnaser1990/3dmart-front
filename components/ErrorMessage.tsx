interface ErrorMessageProps {
  message?: string
  retry?: () => void
}

export default function ErrorMessage({ message, retry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="text-red-500 text-6xl">⚠️</div>
      <h3 className="text-xl font-bold text-gray-800">خطا در بارگذاری</h3>
      <p className="text-gray-600">{message || 'مشکلی پیش آمده است'}</p>
      {retry && (
        <button
          onClick={retry}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          تلاش مجدد
        </button>
      )}
    </div>
  )
}