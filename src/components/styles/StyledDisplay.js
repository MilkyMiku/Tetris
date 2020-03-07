import styled from 'styled-components';

export const StyledDisplay = styled.div`
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 0 20px 0;
    padding: 20px;
    border: 2px solid #999;
    min-height: 30px;
    width: 100%;
    border-radius: 20px;
    color: ${props => (props.gameOver ? 'red' : '#fff')};
    background: #3c414e;
    font-size: 1.5rem;
    text-align: center;
`