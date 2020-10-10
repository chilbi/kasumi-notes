type Classes<TUseStyles extends (props?: any) => Record<string, string>> = Partial<ReturnType<TUseStyles>>;

interface ClassesProps<TUseStyles extends (props?: any) => Record<string, string>> {
  className?: string;
  classes?: Classes<TUseStyles>;
}
