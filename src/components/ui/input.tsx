'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { IconType } from 'react-icons';
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    Icon?: IconType;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ Icon, className, type, ...props }, ref) => {
        const [showPassword, setShowPassword] = React.useState(false);

        const togglePasswordVisibility = () => setShowPassword(!showPassword);

        const inputClasses = cn(
            'h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
            Icon && 'pl-10',
            className,
        );

        return (
            <div className={cn('relative', className)}>
                {Icon && (
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Icon />
                    </div>
                )}
                <input
                    className={inputClasses}
                    type={type === 'password' && showPassword ? 'text' : type}
                    ref={ref}
                    {...props}
                />

                {type === 'password' && (
                    <div className="absolute right-0 flex items-center pr-3 -translate-y-1/2 top-1/2 gap-x-1">
                        {showPassword ? (
                            <EyeOffIcon
                                className="cursor-pointer"
                                onClick={togglePasswordVisibility}
                                size={20}
                            />
                        ) : (
                            <EyeIcon
                                className="cursor-pointer"
                                onClick={togglePasswordVisibility}
                                size={20}
                            />
                        )}
                    </div>
                )}
            </div>
        );
    },
);
Input.displayName = 'Input';

export { Input };
