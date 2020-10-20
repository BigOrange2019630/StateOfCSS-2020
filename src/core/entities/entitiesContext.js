import React, { createContext, useContext, useCallback, useMemo } from 'react'
import { StaticQuery, graphql } from 'gatsby'

export const EntitiesContext = createContext()

const entitiesQuery = graphql`
    query {
        entities: surveyApi {
            entities {
                id
                name
                homepage
            }
        }
    }
`

const findEntity = (entities, key) =>
    entities.find(({ id, name }) => {
        const lowerCaseKey = key.toLowerCase()
        const idMatch = id.toLowerCase() === lowerCaseKey
        const nameMatch = name.toLowerCase() === lowerCaseKey

        return idMatch || nameMatch
    })

const EntitiesContextProviderInner = ({ children, entities }) => {
    const getName = useCallback(
        (id) => {
            const entity = findEntity(entities, id)

            return (entity && entity.name) || id
        },
        [entities]
    )

    const getUrl = useCallback(
        (id) => {
            const entity = findEntity(entities, id)

            return (entity && entity.homepage) || null
        },
        [entities]
    )

    const value = useMemo(
        () => ({
            getName,
            getUrl,
        }),
        [getName, getUrl]
    )

    return <EntitiesContext.Provider value={value}>{children}</EntitiesContext.Provider>
}

export const EntitiesContextProvider = ({ children }) => {
    return (
        <StaticQuery query={entitiesQuery}>
            {({ entities: { entities } }) => (
                <EntitiesContextProviderInner entities={entities}>
                    {children}
                </EntitiesContextProviderInner>
            )}
        </StaticQuery>
    )
}

export const useEntities = () => useContext(EntitiesContext)
