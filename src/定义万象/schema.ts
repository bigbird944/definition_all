export const Schema = z.object({
  用户信息: z.object({
    标签: z.record(z.string(), z.string()).prefault({}),
    备注: z.record(z.string(), z.string()).prefault({})
  }),
  
  场景信息: z.object({
    日期: z.string().prefault(""),
    时刻: z.string().prefault(""),
    地点: z.string().prefault(""),
    天气: z.string().prefault(""),
    环境: z.string().prefault(""),
    备注: z.record(z.string(), z.string()).prefault({})
  }),
  
  在场对象: z.record(
    z.string(),
    z.object({
      类型: z.string(),
      标签: z.record(z.string(), z.string()).prefault({}),
      已编辑: z.boolean()
    })
  ).prefault({}),
  
  编辑对象: z.record(
    z.string(),
    z.object({
      类型: z.string(),
      原始标签: z.record(z.string(), z.string()).prefault({}),
      当前标签: z.record(z.string(), z.string()).prefault({}),
      备注: z.record(z.string(), z.string()).prefault({})
    })
  ).prefault({}),
  
  扫描历史: z.record(z.string(), z.string()).prefault({}),
  
  收藏标签: z.record(z.string(), z.string()).prefault({}),
  
  因果配置: z.record(z.string(), z.string()).prefault({
    感知方式: "世界自动补全因果，所有人认为没有变化",
    生效方式: "即时生效",
    持续性: "永久生效"
  })
});

export type Schema = z.output<typeof Schema>;
