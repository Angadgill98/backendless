package custom_error

type AppError struct {
	Err error
}

func (e AppError) Error() string {
	return e.Err.Error()
}

func (e AppError) Unwrap() error {
	return e.Err
}

type NoRowsInRedis struct{}

func (e NoRowsInRedis) Error() string {
	return "no rows found in redis"
}

type RowVerifiaction struct {}

func (e RowVerifiaction)Error() string {
	return "row data failed to mathc the scehma"
}