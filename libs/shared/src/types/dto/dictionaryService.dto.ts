export class CreateDictionaryDto {
    userId: number
    title: string
}

export class FindDictionariesDto {
    page: number
    limit: number
    userId: number
}

export class FindDictionaryDto {
    userId?: number
    title?: string
    id?: number
}

export class CreateWordDto {
    title: string
    translate: string
    dictionaryId: number
}

export class CreateWordsDto {
    words: {
        title: string
        translate: string
    }[]
    dictionaryId: number
}

export class GetWordsDto {
    limit: number
    page: number
    dictionaryId: number
}

export class DeleteWordDto {
    id: number
    dictionaryId: number
}

export class DeleteWordsDto {
    wordsId: {
        id: string
    }[]
    dictionaryId: number
}

export class ChangeWordsIndexDto {
    wordsIndexes: {
        indexWillBe: number
        id: number
    }[]
} 