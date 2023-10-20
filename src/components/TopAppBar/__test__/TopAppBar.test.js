import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, screen } from '@testing-library/react';
import TopAppBar from '../TopAppBar';
import { allMessages } from '../../../locales/languages';

const expectedVersion = '6.0.2';

const server = setupServer(
  rest.get('/api/v1/tcversion', (req, res, ctx) => res(ctx.json({ ok: true, version: expectedVersion }))),
);

const supportedLocales = [];
Object.values(allMessages).forEach((value) => {
  supportedLocales.push(...value.browserLang);
});

beforeAll(() => {
  server.listen();
});

afterEach(() => server.resetHandlers());

afterAll(() => {
  server.close();
});

it('should render TasmoCompiler version for language', async () => {
  render(
    <TopAppBar classes={{}} locale="pl" changeLanguage={() => {}} />,
  );
  const regex = new RegExp(`${expectedVersion}`);
  const titleElement = await screen.findByText(regex);
  expect(titleElement).toBeInTheDocument;
});
