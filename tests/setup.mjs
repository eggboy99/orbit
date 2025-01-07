import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from 'vitest'

global.render = render;
global.screen = screen;
global.userEvent = userEvent;