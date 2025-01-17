import React, { useCallback, useRef } from 'react';
import { Image, ScrollView, View, KeyboardAvoidingView, Platform, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import api from '../../services/api';

import getValidationErrors from '../../utils/getValidationsErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.png';

import { Container, Title, BacktoSignIn, BacktoSignInText } from './styles';

interface SignUpFormData {
    name: string;
    email: string;
    password: string;
}

const SignUp: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const passwordInputRef = useRef<TextInput>(null);
    const emailInputRef = useRef<TextInput>(null);
    const navigation = useNavigation();

    const handleSignUp = useCallback(async (data: SignUpFormData) => {
        try {
            formRef.current?.setErrors({});

            const schema = Yup.object().shape({
                name: Yup.string().required('Nome obrigatório'),
                email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
                password: Yup.string().min(6, 'No mínimo 6 dígitos')
            });

            await schema.validate(data, {
                abortEarly: false
            });
            await api.post('/users', data);

            Alert.alert('Cadastro realizado com sucesso!', 'Você já pode fazer logon na aplicação.');

            navigation.goBack();
        } catch (e) {
            if (e instanceof Yup.ValidationError) {
                const errors = getValidationErrors(e);

                formRef.current?.setErrors(errors);

                return;
            }
            Alert.alert(
                'Erro no cadastro',
                'Ocorreu um erro ao fazer cadastro, tente novamente.'
            );
        }
    }, [navigation]);

    return (
        <>
            <KeyboardAvoidingView
                style={{flex: 1}}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                enabled
            >
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{flex: 1}}
                >
                    <Container>
                        <Image source={logoImg} />

                        <View>
                            <Title>Crie sua conta</Title>
                        </View>

                        <Form ref={formRef} onSubmit={handleSignUp}>
                            <Input
                                autoCapitalize="words"
                                name="name"
                                icon="user"
                                placeholder="Nome"
                                returnKeyType="next"
                                onSubmitEditing={() => {
                                    emailInputRef.current?.focus();
                                }}
                            />
                            <Input
                                ref={emailInputRef}
                                autoCorrect={false}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                name="email"
                                icon="mail"
                                placeholder="E-mail"
                                returnKeyType="next"onSubmitEditing={() => {
                                    passwordInputRef.current?.focus();
                                }}
                            />
                            <Input
                                ref={passwordInputRef}
                                autoCorrect={false}
                                autoCapitalize="none"
                                name="password"
                                icon="lock"
                                placeholder="Senha"
                                textContentType="newPassword"
                                secureTextEntry
                                returnKeyType="send"
                                onSubmitEditing={() => { formRef.current?.submitForm(); }}
                            />

                            <Button onPress={() => { formRef.current?.submitForm(); }}>Entrar</Button>
                        </Form>
                    </Container>
                </ScrollView>
            </KeyboardAvoidingView>
            <BacktoSignIn onPress={() => navigation.goBack()}>
                <Icon name="arrow-left" size={20} color="#fff" />
                <BacktoSignInText>Voltar para logon</BacktoSignInText>
            </BacktoSignIn>
        </>
    );
};

export default SignUp;
