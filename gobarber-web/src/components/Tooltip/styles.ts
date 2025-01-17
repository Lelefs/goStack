import styled from 'styled-components';

export const Container = styled.div`
    position: relative;

    span {
        width: 170px;
        background: #ff9000;
        padding: 8px;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 500;
        opacity: 0;
        transition: opacity 0.4s;
        position: absolute;
        bottom: calc(100% + 12px);
        left: 50%;
        transform: translateX(-50%);
        color: #312e38;
        visibility: hidden;

        &::before {
            content: '';
            position: absolute;
            border-style: solid;
            border-color: #ff9000 transparent;
            border-width: 6px 6px 0 6px;
            left: 50%;
            transform: translateX(-50%);
            top: 100%;
        }
    }

    &:hover span {
        opacity: 1;
        visibility: visible;
    }
`;
