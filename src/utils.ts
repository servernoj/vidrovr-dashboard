// function executes async handler over a list of items while allowing to
// select the size of "bulk" for concurrent execution
export async function throttler<In = any, Out = any> (
  {
    array,
    handler,
    bulkHandler,
    bulkSize = 10
  }: {
    array: In[],
    bulkSize?: number
    } & (
      {
        handler: (item: In) => Promise<Out>,
        bulkHandler?: never
      } | {
        handler?: never,
        bulkHandler: (item: In[]) => Promise<Out[]>
      }
    )
): Promise<Out[]> {
  const numGroups = Math.ceil(array.length / bulkSize)
  const groups = Array(numGroups).fill([]).map((_, index) => {
    const start = index * bulkSize
    const end = start + bulkSize
    return array.slice(start, end)
  })
  const bulkHandlerMultiplexed = bulkHandler || ((g: In[]) => Promise.all(g.map(handler)))
  return groups.reduce(
    (p, g) => p.then(
      prev => bulkHandlerMultiplexed(g).then(current => [...prev, ...current])
    ),
    Promise.resolve([] as Out[])
  )
}
