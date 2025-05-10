import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
} from '@react-email/components'

// defining interface 
interface verificationEmailProps {
    username: string;
    otp: string;
}

export default function VerificationEmailTemplates({username, otp}: verificationEmailProps){
    return(
        <Html lang='en' dir='ltr'>
            <Head>
                <title>verification code</title>
                <Font
                fontFamily='Roboto'
                fallbackFontFamily= 'Verdana'
                fontWeight={400}
                fontStyle='normal'
                />
            </Head>
            <Preview>here&apos;s your verification code: {otp}</Preview>
            <Section>
                <Row>
                    <Heading as='h2'>Hello {username},</Heading>
                </Row>
                <Row>
                <Text>
                    Thanks you for registering. please use the following verification code to complete your registration:
                </Text>
                </Row>
                <Row>
                    <Text>{otp}</Text>
                </Row>
                <Row>
                    <Text>
                        if you did not request this code, please ignore this email.
                    </Text>
                </Row>
            </Section>
        </Html>

    )
}