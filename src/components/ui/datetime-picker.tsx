'use client';

import { format } from 'date-fns';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Input, InputProps } from './input';
import { Calendar1 } from 'lucide-react';
import { Select } from '@radix-ui/react-select';
import { SelectContent, SelectItem, SelectTrigger } from './select';

interface DateTimePickerProps<T extends FieldValues> extends InputProps {
    control: Control<T>;
    name: FieldPath<T>;
    label?: string;
    description?: string;
    mode?: 'date' | 'dateTime';
}

export function DateTimePicker<T extends FieldValues>({
    control,
    label,
    name,
    description,
    placeholder,
    disabled,
    mode = 'dateTime',
}: DateTimePickerProps<T>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>{label}</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant={'outline'}
                                    disabled={disabled}
                                    className={cn(
                                        'w-full pl-3 text-left font-normal',
                                        !field.value && 'text-muted-foreground',
                                    )}
                                >
                                    {field.value ? (
                                        mode == 'dateTime' ? (
                                            format(field.value, 'dd/MM/yyyy HH:mm')
                                        ) : (
                                            format(field.value, 'dd/MM/yyyy')
                                        )
                                    ) : (
                                        <span>{placeholder}</span>
                                    )}
                                    <Calendar1 className="ml-auto h-4 w-4" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-fit" avoidCollisions={false} side="bottom">
                            <div className="flex justify-between p-2 space-x-1">
                                <Select
                                    value={
                                        field.value
                                            ? field.value.getMonth().toString()
                                            : new Date().getMonth().toString()
                                    }
                                    onValueChange={(value) => {
                                        if (field.value) {
                                            const newDate = new Date(field.value);
                                            newDate.setMonth(parseInt(value, 10));
                                            field.onChange(newDate);
                                        } else {
                                            const newDate = new Date();
                                            newDate.setMonth(parseInt(value, 10));
                                            field.onChange(newDate);
                                        }
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <span className="text-sm">
                                            {field.value
                                                ? format(field.value, 'MMMM', {
                                                      locale: ptBR,
                                                  })
                                                      .charAt(0)
                                                      .toUpperCase() +
                                                  format(field.value, 'MMMM', {
                                                      locale: ptBR,
                                                  }).slice(1)
                                                : format(new Date(), 'MMMM', {
                                                      locale: ptBR,
                                                  })
                                                      .charAt(0)
                                                      .toUpperCase() +
                                                  format(new Date(), 'MMMM', {
                                                      locale: ptBR,
                                                  }).slice(1)}
                                        </span>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <SelectItem key={i} value={i.toString()}>
                                                {format(new Date(2023, i), 'MMMM', {
                                                    locale: ptBR,
                                                })
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    format(new Date(2023, i), 'MMMM', {
                                                        locale: ptBR,
                                                    }).slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Input
                                    type="number"
                                    className="w-full"
                                    value={
                                        field.value
                                            ? field.value.getFullYear()
                                            : new Date().getFullYear()
                                    }
                                    onChange={(e) => {
                                        const year = parseInt(e.target.value, 10);
                                        if (field.value && !isNaN(year)) {
                                            const newDate = new Date(field.value);
                                            newDate.setFullYear(year);
                                            field.onChange(newDate);
                                        } else if (!isNaN(year)) {
                                            const newDate = new Date();
                                            newDate.setFullYear(year);
                                            field.onChange(newDate);
                                        }
                                    }}
                                    placeholder="Ano"
                                />
                            </div>
                            <div className="flex w-full justify-center">
                                <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={(date) => {
                                        if (date) {
                                            const newDate = new Date(date);
                                            if (mode === 'dateTime' && field.value) {
                                                newDate.setHours(field.value.getHours());
                                                newDate.setMinutes(field.value.getMinutes());
                                            }
                                            field.onChange(newDate);
                                        }
                                    }}
                                    initialFocus
                                    month={field.value}
                                    locale={ptBR}
                                />
                                {mode == 'dateTime' && (
                                    <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                                        <ScrollArea className="w-64 sm:w-auto">
                                            <div className="flex sm:flex-col p-2">
                                                {Array.from({ length: 24 }, (_, i) => i)
                                                    .reverse()
                                                    .map((hour) => (
                                                        <Button
                                                            key={hour}
                                                            size="icon"
                                                            variant={
                                                                field.value &&
                                                                field.value.getHours() === hour
                                                                    ? 'default'
                                                                    : 'ghost'
                                                            }
                                                            className="sm:w-full shrink-0 aspect-square"
                                                            onClick={() => {
                                                                const currentDate =
                                                                    field.value || new Date();
                                                                const newDate = new Date(
                                                                    currentDate,
                                                                );

                                                                const value = parseInt(
                                                                    hour.toString(),
                                                                    10,
                                                                );
                                                                newDate.setHours(value);

                                                                field.onChange(newDate);
                                                            }}
                                                        >
                                                            {hour}
                                                        </Button>
                                                    ))}
                                            </div>
                                            <ScrollBar
                                                orientation="horizontal"
                                                className="sm:hidden"
                                            />
                                        </ScrollArea>
                                        <ScrollArea className="w-64 sm:w-auto">
                                            <div className="flex sm:flex-col p-2">
                                                {Array.from({ length: 12 }, (_, i) => i * 5).map(
                                                    (minute) => (
                                                        <Button
                                                            key={minute}
                                                            size="icon"
                                                            variant={
                                                                field.value &&
                                                                field.value.getMinutes() === minute
                                                                    ? 'default'
                                                                    : 'ghost'
                                                            }
                                                            className="sm:w-full shrink-0 aspect-square"
                                                            onClick={() => {
                                                                const currentDate =
                                                                    field.value || new Date();
                                                                const newDate = new Date(
                                                                    currentDate,
                                                                );

                                                                const value = parseInt(
                                                                    minute.toString(),
                                                                    10,
                                                                );
                                                                newDate.setMinutes(value);

                                                                field.onChange(newDate);
                                                            }}
                                                        >
                                                            {minute.toString().padStart(2, '0')}
                                                        </Button>
                                                    ),
                                                )}
                                            </div>
                                            <ScrollBar
                                                orientation="horizontal"
                                                className="sm:hidden"
                                            />
                                        </ScrollArea>
                                    </div>
                                )}
                            </div>
                        </PopoverContent>
                    </Popover>
                    <FormDescription>{description}</FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
