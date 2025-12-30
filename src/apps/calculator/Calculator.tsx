'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { AppProps } from '@/types';

type Operation = '+' | '-' | '*' | '/' | null;

export function Calculator({ windowId }: AppProps) {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<Operation>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = useCallback(
    (digit: string) => {
      if (waitingForOperand) {
        setDisplay(digit);
        setWaitingForOperand(false);
      } else {
        setDisplay(display === '0' ? digit : display + digit);
      }
    },
    [display, waitingForOperand]
  );

  const inputDecimal = useCallback(() => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  }, [display, waitingForOperand]);

  const clear = useCallback(() => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  }, []);

  const clearEntry = useCallback(() => {
    setDisplay('0');
  }, []);

  const toggleSign = useCallback(() => {
    const value = parseFloat(display);
    setDisplay(String(-value));
  }, [display]);

  const inputPercent = useCallback(() => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  }, [display]);

  const performOperation = useCallback(
    (nextOperation: Operation) => {
      const inputValue = parseFloat(display);

      if (previousValue === null) {
        setPreviousValue(inputValue);
      } else if (operation) {
        const currentValue = previousValue;
        let result = 0;

        switch (operation) {
          case '+':
            result = currentValue + inputValue;
            break;
          case '-':
            result = currentValue - inputValue;
            break;
          case '*':
            result = currentValue * inputValue;
            break;
          case '/':
            result = inputValue !== 0 ? currentValue / inputValue : 0;
            break;
        }

        setDisplay(String(result));
        setPreviousValue(result);
      }

      setWaitingForOperand(true);
      setOperation(nextOperation);
    },
    [display, operation, previousValue]
  );

  const calculate = useCallback(() => {
    if (operation === null || previousValue === null) return;

    const inputValue = parseFloat(display);
    let result = 0;

    switch (operation) {
      case '+':
        result = previousValue + inputValue;
        break;
      case '-':
        result = previousValue - inputValue;
        break;
      case '*':
        result = previousValue * inputValue;
        break;
      case '/':
        result = inputValue !== 0 ? previousValue / inputValue : 0;
        break;
    }

    setDisplay(String(result));
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  }, [display, operation, previousValue]);

  const backspace = useCallback(() => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  }, [display]);

  return (
    <div
      className={cn(
        'flex flex-col h-full',
        'bg-win-bg-secondary dark:bg-win-dark-bg-secondary'
      )}
    >
      {/* Display */}
      <div className="p-4 text-right">
        <div className="text-xs text-win-text-secondary dark:text-win-dark-text-secondary h-4">
          {previousValue !== null && operation
            ? `${previousValue} ${operation}`
            : ''}
        </div>
        <div
          className={cn(
            'text-4xl font-light truncate',
            'text-win-text-primary dark:text-win-dark-text-primary'
          )}
        >
          {display}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex-1 grid grid-cols-4 gap-0.5 p-1">
        <CalcButton label="%" onClick={inputPercent} variant="function" />
        <CalcButton label="CE" onClick={clearEntry} variant="function" />
        <CalcButton label="C" onClick={clear} variant="function" />
        <CalcButton label="⌫" onClick={backspace} variant="function" />

        <CalcButton label="1/x" onClick={() => setDisplay(String(1 / parseFloat(display)))} variant="function" />
        <CalcButton label="x²" onClick={() => setDisplay(String(Math.pow(parseFloat(display), 2)))} variant="function" />
        <CalcButton label="√" onClick={() => setDisplay(String(Math.sqrt(parseFloat(display))))} variant="function" />
        <CalcButton label="÷" onClick={() => performOperation('/')} variant="operator" isActive={operation === '/'} />

        <CalcButton label="7" onClick={() => inputDigit('7')} />
        <CalcButton label="8" onClick={() => inputDigit('8')} />
        <CalcButton label="9" onClick={() => inputDigit('9')} />
        <CalcButton label="×" onClick={() => performOperation('*')} variant="operator" isActive={operation === '*'} />

        <CalcButton label="4" onClick={() => inputDigit('4')} />
        <CalcButton label="5" onClick={() => inputDigit('5')} />
        <CalcButton label="6" onClick={() => inputDigit('6')} />
        <CalcButton label="-" onClick={() => performOperation('-')} variant="operator" isActive={operation === '-'} />

        <CalcButton label="1" onClick={() => inputDigit('1')} />
        <CalcButton label="2" onClick={() => inputDigit('2')} />
        <CalcButton label="3" onClick={() => inputDigit('3')} />
        <CalcButton label="+" onClick={() => performOperation('+')} variant="operator" isActive={operation === '+'} />

        <CalcButton label="±" onClick={toggleSign} />
        <CalcButton label="0" onClick={() => inputDigit('0')} />
        <CalcButton label="." onClick={inputDecimal} />
        <CalcButton label="=" onClick={calculate} variant="equals" />
      </div>
    </div>
  );
}

interface CalcButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'number' | 'operator' | 'function' | 'equals';
  isActive?: boolean;
}

function CalcButton({
  label,
  onClick,
  variant = 'number',
  isActive = false,
}: CalcButtonProps) {
  const baseClasses =
    'flex items-center justify-center text-lg font-medium rounded transition-colors duration-100';

  const variantClasses = {
    number: cn(
      'bg-white dark:bg-win-dark-bg',
      'text-win-text-primary dark:text-win-dark-text-primary',
      'hover:bg-gray-100 dark:hover:bg-white/10',
      'active:bg-gray-200 dark:active:bg-white/20'
    ),
    operator: cn(
      isActive
        ? 'bg-win-accent text-white'
        : 'bg-gray-100 dark:bg-white/5',
      'text-win-text-primary dark:text-win-dark-text-primary',
      'hover:bg-gray-200 dark:hover:bg-white/10',
      'active:bg-gray-300 dark:active:bg-white/20'
    ),
    function: cn(
      'bg-gray-100 dark:bg-white/5',
      'text-win-text-primary dark:text-win-dark-text-primary',
      'hover:bg-gray-200 dark:hover:bg-white/10',
      'active:bg-gray-300 dark:active:bg-white/20'
    ),
    equals: cn(
      'bg-win-accent text-white',
      'hover:bg-win-accent/90',
      'active:bg-win-accent/80'
    ),
  };

  return (
    <button onClick={onClick} className={cn(baseClasses, variantClasses[variant])}>
      {label}
    </button>
  );
}
