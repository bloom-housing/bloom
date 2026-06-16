import { SmsService } from '../../../src/services/sms.service';

describe('Testing sms service', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('Twilio provider (default)', () => {
    it('should initialize Twilio client when credentials are present', () => {
      process.env.TWILIO_ACCOUNT_SID = 'AC123';
      process.env.TWILIO_AUTH_TOKEN = 'auth-token';
      const service = new SmsService();
      expect(service.client).toBeDefined();
      expect(service.awsClient).toBeUndefined();
    });

    it('should not initialize Twilio client when credentials are missing', () => {
      delete process.env.TWILIO_ACCOUNT_SID;
      delete process.env.TWILIO_AUTH_TOKEN;
      const service = new SmsService();
      expect(service.client).toBeUndefined();
    });

    it('should silently return when Twilio client is not initialized', async () => {
      delete process.env.TWILIO_ACCOUNT_SID;
      delete process.env.TWILIO_AUTH_TOKEN;
      const service = new SmsService();
      await expect(
        service.sendMfaCode('+15555555555', '12345'),
      ).resolves.toBeUndefined();
    });

    it('should send message via Twilio', async () => {
      process.env.TWILIO_ACCOUNT_SID = 'AC123';
      process.env.TWILIO_AUTH_TOKEN = 'auth-token';
      process.env.TWILIO_PHONE_NUMBER = '+15550001111';
      const service = new SmsService();
      service.client = {
        messages: { create: jest.fn().mockResolvedValue({}) },
      } as any;
      await service.sendMfaCode('+15555555555', '12345');
      expect(service.client.messages.create).toHaveBeenCalledWith({
        body: 'Your Partners Portal account access token: 12345',
        from: '+15550001111',
        to: '+15555555555',
      });
    });
  });

  describe('AWS End User Messaging provider', () => {
    it('should initialize AWS client when SMS_PROVIDER is aws', () => {
      process.env.SMS_PROVIDER = 'aws';
      process.env.AWS_SMS_REGION = 'us-east-1';
      const service = new SmsService();
      expect(service.awsClient).toBeDefined();
      expect(service.client).toBeUndefined();
    });

    it('should silently return when AWS client is not initialized', async () => {
      process.env.SMS_PROVIDER = 'aws';
      delete process.env.AWS_SMS_REGION;
      const service = new SmsService();
      await expect(
        service.sendMfaCode('+15555555555', '12345'),
      ).resolves.toBeUndefined();
    });

    it('should send message via AWS End User Messaging', async () => {
      process.env.SMS_PROVIDER = 'aws';
      process.env.AWS_SMS_REGION = 'us-east-1';
      process.env.AWS_SMS_ORIGINATION_NUMBER =
        'arn:aws:sms-voice:us-east-1:123456789012:phone-number/test';
      const service = new SmsService();
      const sendMock = jest.fn().mockResolvedValue({});
      service.awsClient = { send: sendMock } as any;
      await service.sendMfaCode('+15555555555', '12345');
      const [command] = sendMock.mock.calls[0];
      expect(command.input).toEqual({
        DestinationPhoneNumber: '+15555555555',
        OriginationIdentity:
          'arn:aws:sms-voice:us-east-1:123456789012:phone-number/test',
        MessageBody: 'Your Partners Portal account access token: 12345',
        MessageType: 'TRANSACTIONAL',
      });
    });
  });
});
