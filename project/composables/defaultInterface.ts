export interface StrapiDefaultCollectionObject {
    id: number
    documentId: string
}

export interface StrapiDefaultImageObject {
    id: number
    documentId: string
    name: string
    alternativeText: string
    caption: string
    width: number
    height: number
    formats: {
        large: StrapiDefaultImageFormatsObject
        small: StrapiDefaultImageFormatsObject
        medium: StrapiDefaultImageFormatsObject
        thumbnail: StrapiDefaultImageFormatsObject
    }
    hash: string
    ext: string
    mime: string
    size: number
    url: string
    previewUrl: string
    provider: string
    provider_metadata: string
    createdAt: string
    updatedAt: string
    publishedAt: string
}

export interface StrapiDefaultImageFormatsObject {
    ext: string
    url: string
    hash: string
    mime: string
    name: string
    path: string
    size: number
    width: number
    height: number
    sizeInBytes: number
}