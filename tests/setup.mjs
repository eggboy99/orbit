import { render, screen, within, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Extend global with our testing utilities
global.render = render;
global.screen = screen;
global.within = within;
global.fireEvent = fireEvent;
global.waitFor = waitFor;
global.userEvent = userEvent;
global.location = window.location;

// Vitest globals
global.describe = describe;
global.it = it;
global.expect = expect;
global.vi = vi;
global.beforeEach = beforeEach;
global.afterEach = afterEach;
