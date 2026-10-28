export const hasText = (value?: string | null) => !!value?.trim()

export const asList = <T>(value?: T[] | null): T[] => (Array.isArray(value) ? value : [])
