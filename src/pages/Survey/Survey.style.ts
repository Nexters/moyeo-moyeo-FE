import styled from '@emotion/styled';

export const Container = styled.div`
  background-color: rgba(12, 13, 14, 0.6);
  width: 480px;
  border-radius: 40px;
  padding: 30px;
  display: flex;
  gap: 10px;
  flex-direction: column;
`;

export const Title = styled.h1`
  ${({ theme }) => theme.textStyles.h1}
  color: ${({ theme }) => theme.colors.white};
`;

export const Label = styled.label`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.white};
`;

export const SubmitButton = styled.button`
  padding: 0 20px;
  height: 50px;
  border-radius: 10px;
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme }) => theme.colors.blue[800]};
  margin: 0 auto;
  margin-top: 20px;
`;
