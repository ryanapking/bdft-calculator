export default {
  container: 'w-full flex gap-2 justify-between items-center',
  left: {
    base: 'grow shrink flex items-center gap-2',
    icon: 'shrink-0',
    title: 'w-full',
  },
  center: {
    base: 'w-[600px] min-w-[600px] grid grid-cols-6 gap-2',
    material: 'col-start-1 col-span-2 text-center flex flex-col',
    length: 'col-start-3',
    width: 'col-start-4',
    cost: 'col-start-5 text-center',
    qty: 'col-start-6 text-center',
  },
  right: {
    base: 'flex flex-col items-center opacity-30 hover:opacity-100 focus-within:opacity-100',
    buttonGroup: 'flex gap-3',
    button: 'w-10 h-10 border border-transparent flex items-center justify-center rounded-lg hover:bg-gray-50 hover:border-gray-200 focus:bg-gray-50 focus:outline-none focus:ring-1 focus:border-cyan-500 focus:ring-cyan-500',
  },
}