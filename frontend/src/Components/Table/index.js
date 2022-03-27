import styled from 'styled-components'
import Colours from '../../Config/Colours.js'

const Table = styled.table`
   border-collapse: collapse;
   border: .5px solid ${Colours.n800};
   border-top-left-radius: 4px;
   border-top-right-radius: 4px;
   border-radius: 4px;
   
   width: 100%;

   ${props => props.grey ? `
     & thead {
       background: ${Colours.n825} !important;
     }

     & th, & td {
       color: ${Colours.n200};
     }
   ` : ''}

   ${props => props.borderCollapse ? `
    box-shadow: 0px 0px 1px rgba(48, 49, 51, 0.05), 0px 4px 8px rgba(48, 49, 51, 0.1);
    border-radius: 4px;
    border: 0;

    & tr {
      border-bottom: 0;
    }

    & th, & td {
      border-right: 0;
    }
   ` : ''}

   ${props => props.zebra ? `
    & tbody > tr {
      &:nth-child(even) {
        background: ${Colours.n850};
      }
    }
   ` : ''}

   ${props => props.compact ? `
    & th {
      padding-top: 8px;
      padding-bottom: 8px;
      white-space: nowrap;
    }
   ` : ''}

   ${props => !props.noClip ? `
    @media screen and (max-width: 720px) {
      & td, & th {
        max-width: 32px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;

        &.noclip {
            max-width: unset;
            text-overflow: unset;
            overflow: unset;
            white-space: unset;
        }
      }

      & td.actions {
        text-align: center;
        position: relative;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
    }
   ` : ''}
   
  ${props => props.stacked ? `
    display: flex;
    flex-direction: column;
    border: 0;

    & thead {
        display: none;
    }

    & tbody {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    & tr {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        border: .5px solid #E0E0E0;
        border-radius: 4px;

        margin-bottom: 4px;
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;

        padding-bottom: 8px;
    }

    & td {
        position: relative;
        display: flex;
        flex: 1;
        flex-direction: column;
        align-items: center;
        max-width: unset;
        overflow: unset;
        white-space: normal;
        height: unset;

        position: relative;
        border: 0;
        align-items: flex-start;

        &:first-of-type {
            padding-top: 8px;
        }

        &:last-of-type {
          flex-direction: row;
          gap: 8px;
          padding-bottom: 12px;
          justify-content: space-between;
          flex: 1;
          width: calc(100% - 32px);
          padding-top: 16px;
          border-top: 1px solid #e0e0e0;
          
          & > img {
              margin-right: 0 !important;

              &:first-of-type {
                  order: 2;
              }

              &:last-of-type {
                  order: 1;
              }
          }
      }
    }

  ` : ''}
 
  ${props => props.fixed ? `
    table-layout: fixed;

    & td {
      overflow-wrap: break-word;
    }
  ` : ''}
`

const Head = styled.thead`
   background: ${Colours.t100};
`

const Heading = styled.th`
  text-align: left;
  padding: 16px;
  border-right: .5px solid ${Colours.n800};
  color: ${Colours.n500};
  font-size: 16px;

  &:last-of-type {
    border-right: 0;
  }

  ${props => props.centered ? `
    text-align: center; 
    vertical-align: middle;
  ` : ''}
`

const Body = styled.tbody`
    
`

const Row = styled.tr`
    border-bottom: .5px solid ${Colours.n800};
    &:last-of-type {
        border-bottom: 0;
    }
`

const Col = styled.td`
    
    height: 48px;
    padding: 0 16px;
    border-right: .5px solid ${Colours.n800};
    color: ${Colours.n500};
    font-size: 16px;
    
  &:last-of-type {
    border-right: 0;
  }

  ${props => props.centered ? `
    text-align: center; 
    vertical-align: middle;
  ` : ''}
`

/**
 * Styled components necessary for rendering a table ala the sites designs
 */
export {
    Table,
    Head,
    Heading,
    Body,
    Row,
    Col
}
