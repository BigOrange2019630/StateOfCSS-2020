import React, { memo } from 'react'
import styled, { useTheme } from 'styled-components'
import PropTypes from 'prop-types'
import { ResponsiveBubble } from '@nivo/circle-packing'
import ChartLabel from 'core/components/ChartLabel'
import { FeaturesCirclePackingChartTooltip } from './FeaturesCirclePackingChartTooltip'

const fontSizeByRadius = (radius) => {
    if (radius < 25) return 8
    if (radius < 35) return 10
    if (radius < 45) return 12
    return 14
}

const sectionLabelOffsets = {
    layout: 75,
    shapes_graphics: 320,
    interactions: 100,
    typography: 320,
    animations_transforms: 50,
    media_queries: 0,
    other_features: 135,
}

const Node = ({ node, handlers }) => {
    const radius = node.r
    const theme = useTheme()

    if (node.depth === 0) {
        return null
    }

    if (node.depth === 1 && node.data.isSection) {
        const color = theme.colors.ranges.featureSections[node.data.id]

        return (
            <g transform={`translate(${node.x},${node.y})`}>
                <defs>
                    <path
                        d={`M-${radius},0a${radius},${radius} 0 1,0 ${
                            radius * 2
                        },0a${radius},${radius} 0 1,0 -${radius * 2},0`}
                        id={`textcircle-${node.data.id}`}
                    />
                </defs>
                <CirclePackingNodeCategoryLabel dy={30}>
                    <textPath
                        xlinkHref={`#textcircle-${node.data.id}`}
                        side="right"
                        fill={color}
                        style={{
                            fontWeight: '600',
                            fontSize: '0.9rem',
                        }}
                        startOffset={sectionLabelOffsets[node.data.id]}
                    >
                        {node.id}
                    </textPath>
                </CirclePackingNodeCategoryLabel>
                <circle
                    r={node.r}
                    fill={theme.colors.backgroundAlt}
                    fillOpacity={0.4}
                    stroke={color}
                    strokeWidth={1}
                    strokeLinecap="round"
                    strokeDasharray="2 3"
                />
            </g>
        )
    }

    const usageRadius = node.r * (node.data.usage / node.data.awareness)
    const color = theme.colors.ranges.featureSections[node.data.sectionId]

    return (
        <CirclePackingNode
            className="CirclePackingNode"
            transform={`translate(${node.x},${node.y})`}
            onMouseEnter={handlers.onMouseEnter}
            onMouseMove={handlers.onMouseMove}
            onMouseLeave={handlers.onMouseLeave}
        >
            <circle r={node.r} fill={`${color}50`} />
            <circle r={usageRadius} fill={color} />
            <ChartLabel label={node.label} fontSize={fontSizeByRadius(node.r)} />
        </CirclePackingNode>
    )
}

const FeaturesCirclePackingChart = ({ data, className }) => {
    const theme = useTheme()

    return (
        <Chart className={`CirclePackingChart ${className}`}>
            <ResponsiveBubble
                theme={theme.charts}
                margin={{
                    top: 2,
                    right: 2,
                    bottom: 2,
                    left: 2,
                }}
                identity="name"
                leavesOnly={false}
                padding={5}
                colors={['white', 'blue']}
                root={data}
                value="awareness"
                nodeComponent={Node}
                animate={false}
                tooltip={FeaturesCirclePackingChartTooltip}
            />
        </Chart>
    )
}

FeaturesCirclePackingChart.propTypes = {
    data: PropTypes.shape({
        features: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                usage: PropTypes.shape({
                    total: PropTypes.number.isRequired,
                    buckets: PropTypes.arrayOf(
                        PropTypes.shape({
                            id: PropTypes.string.isRequired,
                            count: PropTypes.number.isRequired,
                            percentage: PropTypes.number.isRequired,
                        })
                    ).isRequired,
                }).isRequired,
            })
        ),
    }),
}

const Chart = styled.div`
    svg {
        overflow: visible;
    }
`

const CirclePackingNode = styled.g`
    &.CirclePackingNode--inactive {
        opacity: 0.15;
    }
`

const CirclePackingNodeCategoryLabel = styled.text`
    fill: ${({ theme }) => theme.colors.link};
    opacity: 0.65;
`

export default memo(FeaturesCirclePackingChart)
